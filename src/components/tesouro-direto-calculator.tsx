'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { displayMoney } from '@/lib/displayMoney';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Calculator, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DateField } from './ui/date-field';
import { Form } from './ui/form';
import { MoneyInput } from './ui/money-input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

function TesouroDiretoCalculator() {
  const form = useForm({
    defaultValues: async () => {
      const saved = localStorage.getItem('tesouro-direto-calculator');
      if (!saved)
        return {
          contractedRate: 0,
          investmentValue: 0,
          currentSellingValue: 0,
          purchaseDate: null,
          saleDate: null,
          maturityDate: null,
        };
      return JSON.parse(saved);
    },
  });
  const [result, setResult] = useState<any | null>(null);

  const calculateIRRate = (days: number) => {
    if (days <= 180) return 0.225;
    if (days <= 360) return 0.2;
    if (days <= 720) return 0.175;
    return 0.15;
  };

  const handleCalculate = () => {
    const {
      contractedRate,
      investmentValue,
      currentSellingValue,
      purchaseDate,
      saleDate,
      maturityDate,
    } = form.getValues();

    if (!purchaseDate || !saleDate || !maturityDate) {
      alert('Por favor, selecione todas as datas necessárias.');
      return;
    }

    const investment = Number.parseFloat(investmentValue);
    const selling = Number.parseFloat(currentSellingValue);
    // const adjusted = Number.parseFloat(adjustedValue);

    const purchaseMoment = dayjs(purchaseDate);
    const saleMoment = dayjs(saleDate);
    const maturityMoment = dayjs(maturityDate);

    const totalMonths = Math.floor(
      maturityMoment.diff(purchaseMoment, 'day') / 30
    );
    const remainingMonths = Math.floor(
      maturityMoment.diff(saleMoment, 'day') / 30
    );

    const investmentDays = saleMoment.diff(purchaseMoment, 'day');
    const remainingDays = maturityMoment.diff(saleMoment, 'day');

    const profit = selling - investment;
    const irRate = calculateIRRate(investmentDays);
    const irValue = profit > 0 ? profit * irRate : 0;
    const netValue = selling - irValue;

    const annualizedReturn =
      ((selling / investment) ** (365 / investmentDays) - 1) * 100;
    const normallyReturn =
      investment * (1 + contractedRate / 100) ** (totalMonths / 12);

    setResult({
      currentValue: selling,
      absoluteReturn: profit,
      percentageReturn: (profit / investment) * 100,
      annualizedReturn: annualizedReturn,
      remainingDays,
      investmentDays,
      remainingMonths,
      irRate: (irRate * 100).toFixed(1),
      irValue: irValue,
      netValue: netValue,
      normallyReturn: normallyReturn,
    });
    localStorage.setItem(
      'tesouro-direto-calculator',
      JSON.stringify(form.getValues())
    );
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 py-20">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Calculadora de Marcação a Mercado - Tesouro Direto
          </CardTitle>
          <CardDescription>
            Calcule a marcação a mercado, IR e obtenha sugestões de
            reinvestimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <MoneyInput
                    name="contractedRate"
                    label="Taxa Contratada (% a.a.)"
                    control={form.control}
                    placeholder="Digite o valor de venda atual"
                    style="decimal"
                    required
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 inline-block ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Taxa de juros anual contratada na compra do título
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </MoneyInput>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <MoneyInput
                    name="investmentValue"
                    label="Valor Investido (R$)"
                    control={form.control}
                    placeholder="Digite o valor investido"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <MoneyInput
                    name="currentSellingValue"
                    label="Valor de Venda Atual (R$)"
                    control={form.control}
                    placeholder="Digite o valor de venda atual"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <DateField
                    name="purchaseDate"
                    label="Data de Aplicação"
                    control={form.control}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <DateField
                    name="saleDate"
                    label="Data de Venda"
                    control={form.control}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <DateField
                    name="maturityDate"
                    label="Data de Vencimento"
                    control={form.control}
                    required
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full" onClick={handleCalculate}>
            <Calculator className="mr-2 h-4 w-4" /> Calcular Marcação a Mercado
            considerando IR
          </Button>
        </CardFooter>
        {result && (
          <CardContent>
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-semibold text-lg mb-2">
                Resultado da Marcação a Mercado
              </h3>
              <div className="flex flex-col leading-none gap-2">
                <p>
                  Valor Atual:{' '}
                  <strong>{displayMoney(result.currentValue)}</strong>
                </p>
                <p>
                  Retorno Absoluto:{' '}
                  <strong>{displayMoney(result.absoluteReturn)}</strong>
                </p>
                <p>
                  Retorno pós IR:{' '}
                  <strong>
                    {displayMoney(result.absoluteReturn - result.irValue)}
                  </strong>
                </p>
                <p>
                  Valor Líquido:{' '}
                  <strong>{displayMoney(result.netValue)}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {result && (
        <div className="mt-4">
          <h4 className="font-semibold">Sugestão de Reinvestimento:</h4>
          <p>
            O reinvestimento deve cobrir o valor (
            <strong>{displayMoney(result.normallyReturn)}</strong>) se fosse
            deixar o dinheiro no mesmo título.
          </p>

          <div className="rounded-md border w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Investimento %</TableHead>
                  <TableHead>Valor investido</TableHead>
                  <TableHead>Retorno Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  7, 7.5, 8, 8.5, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5,
                ].map((percentage) => (
                  <TableRow
                    key={percentage}
                    className={cn(
                      'hover:bg-muted',
                      result.netValue *
                        (1 + percentage / 100) **
                          (result.remainingMonths / 12) >=
                        result.normallyReturn &&
                        'bg-green-300 hover:bg-green-400'
                    )}
                  >
                    <TableCell>{percentage}%</TableCell>
                    <TableCell>{displayMoney(result.netValue)}</TableCell>
                    <TableCell>
                      {/* {displayMoney(result.netValue * (1 + percentage / 100))} */}
                      {displayMoney(
                        result.netValue *
                          (1 + percentage / 100) **
                            (result.remainingMonths / 12)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export { TesouroDiretoCalculator };
